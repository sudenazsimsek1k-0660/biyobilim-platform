"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  pdfUrl: string;
};

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function previousPage() {
    setPageNumber((current) => Math.max(current - 1, 1));
  }

  function nextPage() {
    setPageNumber((current) =>
      Math.min(current + 1, numPages)
    );
  }

  function zoomIn() {
    setScale((current) => Math.min(current + 0.15, 2));
  }

  function zoomOut() {
    setScale((current) => Math.max(current - 0.15, 0.6));
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        previousPage();
      }

      if (event.key === "ArrowRight") {
        nextPage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [numPages]);

  return (
    <div className="overflow-hidden rounded-2xl bg-[#13251f] shadow-2xl ring-1 ring-white/10">
      
      {/* ÜST KONTROLLER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0c2019] px-4 py-3">
        
        <div className="flex items-center gap-2">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="rounded-lg px-3 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>

          <span className="min-w-[90px] text-center text-sm font-medium text-white">
            {numPages > 0
              ? `${pageNumber} / ${numPages}`
              : "Yükleniyor..."}
          </span>

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="rounded-lg px-3 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>

        {/* ZOOM */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="rounded-lg px-3 py-2 text-lg text-white transition hover:bg-white/10"
          >
            −
          </button>

          <span className="min-w-[55px] text-center text-xs text-white/70">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="rounded-lg px-3 py-2 text-lg text-white transition hover:bg-white/10"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF */}
      <div className="flex min-h-[70vh] justify-center overflow-auto bg-[#3b4642] p-3 sm:p-6">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex min-h-[70vh] items-center justify-center">
              <p className="text-sm text-white/70">
                Dergi yükleniyor...
              </p>
            </div>
          }
          error={
            <div className="flex min-h-[70vh] items-center justify-center">
              <p className="text-sm text-red-300">
                Dergi yüklenirken bir hata oluştu.
              </p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>

      {/* ALT KONTROLLER */}
      <div className="flex items-center justify-center border-t border-white/10 bg-[#0c2019] px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="rounded-xl border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Önceki
          </button>

          <span className="text-sm text-white/60">
            Sayfa {pageNumber} / {numPages || "…"}
          </span>

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="rounded-xl border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Sonraki →
          </button>
        </div>
      </div>
    </div>
  );
}