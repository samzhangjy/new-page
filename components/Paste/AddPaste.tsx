import { Button, FileInput, Modal, Select, Space, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PasteType } from '@prisma/client';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { cloudinaryInfo } from '../../config';
import useApi from '../../hooks/useApi';
import { CreatePasteResponse } from '../../pages/api/pastepad/new';

export type AddPasteProps = {
  onReload: () => void;
};

const acceptFileTypes = {
  IMAGE: 'image/*',
  VIDEO: 'video/*',
  FILE: '*',
};

const cloudinaryResourceTypeMap = {
  IMAGE: 'image',
  VIDEO: 'video',
  FILE: 'raw',
};

export type UploadFileResponse = {
  filename: string;
  url: string;
  filesize: number;
};

const uploadFile = async (file: File, type: PasteType): Promise<UploadFileResponse | null> => {
  if (type === 'TEXT') return null;
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', cloudinaryInfo.uploadPreset);
  data.append('api_key', cloudinaryInfo.apiKey);
  const api = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryInfo.cloudName}/${cloudinaryResourceTypeMap[type]}/upload`,
    {
      method: 'POST',
      body: data,
    }
  );
  const res = await api.json();
  return {
    filename: `${res.original_filename}.${res.format ?? res.public_id.split('.', 2)[1]}`,
    url: res.url,
    filesize: parseInt(res.bytes, 10),
  };
};

const AddPaste = ({ onReload }: AddPasteProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [pasteType, setPasteType] = useState<PasteType>('TEXT');
  const [fileData, setFileData] = useState<File>();
  const [contentError, setContentError] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const body = {
      contents: '',
      filename: '',
      filesize: 0,
    };

    if (pasteType !== 'TEXT') {
      if (!fileData) {
        setContentError('Please select the file to upload.');
        return;
      }
      const uploadRes = (await uploadFile(fileData, pasteType))!;
      body.contents = uploadRes.url;
      body.filename = uploadRes.filename;
      body.filesize = uploadRes.filesize;
    } else {
      body.contents = content;
    }

    const api = await useApi('/api/pastepad/new', {
      method: 'POST',
      token: getCookie('ACCESS_TOKEN') as string,
      body: {
        ...body,
        type: pasteType,
      },
    });

    const res: CreatePasteResponse = await api.json();
    if (res.status !== 'success') {
      showNotification({
        color: 'red',
        title: 'Failed to create paste',
        message: res.msg,
      });
      return;
    }
    setIsOpened(false);
    onReload();
  };

  return (
    <>
      <Modal opened={isOpened} onClose={() => setIsOpened(false)} title="Add new paste">
        <Select
          label="Paste type"
          placeholder="Select your paste type"
          data={[
            { value: 'TEXT', label: 'Plain text' },
            { value: 'IMAGE', label: 'Image' },
            { value: 'VIDEO', label: 'Video' },
            { value: 'FILE', label: 'Raw file' },
          ]}
          value={pasteType}
          onChange={(val) => {
            setPasteType(val! as PasteType);
            setContentError('');
          }}
          transition="pop"
          transitionDuration={80}
          transitionTimingFunction="ease"
        />
        <Space h={10} />
        {pasteType === 'TEXT' ? (
          <Textarea
            autosize
            minRows={4}
            maxRows={15}
            label="Paste content"
            placeholder="Enter your paste content here"
            onChange={(e) => setContent(e.target.value)}
            error={contentError}
          />
        ) : (
          <FileInput
            accept={acceptFileTypes[pasteType]}
            label="Paste content"
            placeholder="Select your file to upload"
            onChange={(payload) => setFileData(payload!)}
            error={contentError}
          />
        )}
        <Space h={15} />
        <Button fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </Modal>
      <Button variant="light" onClick={() => setIsOpened(true)}>
        Add paste
      </Button>
    </>
  );
};

export default AddPaste;
