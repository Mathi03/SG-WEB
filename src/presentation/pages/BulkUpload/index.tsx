"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { ScrollArea } from "@components/ui/scroll-area";
import { FileIcon, UploadCloud, X } from "lucide-react";

export default function BulkUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir archivos");
      alert("Archivos subidos correctamente");
      setFiles([]);
    } catch {
      /* empty */
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-black-600" />
            Subir Documentos
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="document-upload" className="block mb-1">
              Selecciona tus archivos
            </Label>
            <Input
              id="document-upload"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <ScrollArea className="h-32 border rounded-md p-2">
              <ul className="space-y-2 text-sm">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b pb-1"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                      {file.name}
                    </div>
                    <button onClick={() => removeFile(index)}>
                      <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              type="button"
              onClick={() => setFiles([])}
              disabled={files.length === 0}
            >
              Limpiar
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0}>
              Subir Archivos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
