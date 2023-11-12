'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import { OutputFileEntry } from '@uploadcare/blocks';

import st from './FileUploader.module.css';
import cs from 'classnames';

LR.registerBlocks(LR);

type FileUploaderProps = {
  uploaderClassName: string;
  files: OutputFileEntry[];
  onChange: (files: OutputFileEntry[]) => void;
  theme: 'light' | 'dark';
};

export default function FileUploader({
  files,
  uploaderClassName,
  onChange,
  theme,
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<OutputFileEntry[]>([]);
  const ctxProviderRef = useRef<LR.UploadCtxProvider>();

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry['uuid']) =>
      onChange(files.filter((f) => f.uuid !== uuid)),
    [files, onChange]
  );

  useEffect(() => {
    const handleUploadEvent = (e: CustomEvent<{ data: OutputFileEntry[] }>) => {
      console.log('e.detail.data:', e.detail?.data);
      if (e.detail?.data) {
        setUploadedFiles([...e.detail.data]);
      }
    };

    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/data-and-events/#events
     */
    window.addEventListener('LR_DATA_OUTPUT', handleUploadEvent);

    return () => {
      window.removeEventListener('LR_DATA_OUTPUT', handleUploadEvent);
    };
  }, [setUploadedFiles]);

  useEffect(() => {
    /*
      Note: Here we use provider's API to reset File Uploader state.
      It's not necessary though. We use it here to show users
      a fresh version of File Uploader every time they open it.

      Another way is to sync File Uploader state with an external store.
      You can manipulate File Uploader using API calls like `addFileFromObject`, etc.

      See more: https://uploadcare.com/docs/file-uploader/api/
     */
    const resetUploaderState = () =>
      ctxProviderRef.current?.uploadCollection.clearAll();

    const handleDoneFlow = () => {
      resetUploaderState();

      onChange([...files, ...uploadedFiles]);
      setUploadedFiles([]);
    };

    window.addEventListener('LR_DONE_FLOW', handleDoneFlow);

    return () => {
      window.removeEventListener('LR_DONE_FLOW', handleDoneFlow);
    };
  }, [files, onChange, uploadedFiles, setUploadedFiles]);

  const handleUploadEvent = (e: CustomEvent<{ data: OutputFileEntry[] }>) => {
    if (e.detail?.data) {
      setUploadedFiles(e.detail.data);
    }
  };

  return (
    <div className={st.root}>
      <lr-config
        ctx-name="my-uploader"
        pubkey="9e050a5302218c1e1d2e"
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList="local, url, camera, dropbox"
      ></lr-config>

      <lr-file-uploader-regular
        css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.25.0/web/lr-file-uploader-regular.min.css"
        ctx-name="my-uploader"
        class="my-config"
      ></lr-file-uploader-regular>
    </div>
  );
}
