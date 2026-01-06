import { useState } from "react";

export default function useArchiveConfirm() {
  const [archiveConfirm, setArchiveConfirm] = useState({ open: false, idx: null, productName: "" });

  const openArchiveConfirm = (idx, productName = "") => {
    setArchiveConfirm({ open: true, idx, productName });
  };

  const confirmArchive = () => {
    setArchiveConfirm({ open: false, idx: null });
  };

  const cancelArchive = () => {
    setArchiveConfirm({ open: false, idx: null });
  };

  return {
    archiveConfirm,
    openArchiveConfirm,
    confirmArchive,
    cancelArchive,
    setArchiveConfirm,
  };
}
