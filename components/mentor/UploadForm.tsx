"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadResult {
  videoUrl?: string
  cvUrl?: string
}

export default function UploadForm({ mentorId }: { mentorId: string }) {
  const [video, setVideo] = useState<File | null>(null)
  const [cv, setCv] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState("")

  const onSubmit = async () => {
    setError("")
    setIsUploading(true)
    setResult(null)
    try {
      const form = new FormData()
      if (video) form.append("video", video)
      if (cv) form.append("cv", cv)
      form.append("mentorId", mentorId)

      const res = await fetch("/api/upload-files", {
        method: "POST",
        body: form,
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setResult({ videoUrl: data.videoUrl, cvUrl: data.cvUrl })
    } catch (e: any) {
      setError(e.message || "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Hub Uploads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Video (MP4)</Label>
            <Input type="file" accept="video/mp4" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <Label>CV (PDF)</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setCv(e.target.files?.[0] || null)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSubmit} disabled={isUploading || (!video && !cv)}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {result && (
          <div className="text-sm text-muted-foreground space-y-1">
            {result.videoUrl && (
              <div>
                Video uploaded: <a className="underline" href={result.videoUrl} target="_blank" rel="noreferrer">{result.videoUrl}</a>
              </div>
            )}
            {result.cvUrl && (
              <div>
                CV uploaded: <a className="underline" href={result.cvUrl} target="_blank" rel="noreferrer">{result.cvUrl}</a>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Files are stored under /public/uploads and can be linked to mentees later.
        </div>
      </CardContent>
    </Card>
  )
}



