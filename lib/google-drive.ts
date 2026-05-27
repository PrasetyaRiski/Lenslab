import { google } from "googleapis";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { Readable } from "stream";
import path from "path";

export type DriveUploadResult = {
  driveFileId: string;
  previewUrl: string;
  downloadUrl: string;
};

function isDriveConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REDIRECT_URI &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID
  );
}

export { isDriveConfigured };

function getDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.drive({ version: "v3", auth: oauth2Client });
}

export async function uploadFileToDrive(file: File, folderName: string): Promise<DriveUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!isDriveConfigured()) {
    const safeFolder = folderName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "files";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const fileName = `${randomUUID()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    const publicUrl = `/uploads/${safeFolder}/${fileName}`;
    return {
      driveFileId: `local:${safeFolder}/${fileName}`,
      previewUrl: publicUrl,
      downloadUrl: publicUrl
    };
  }

  const drive = getDriveClient();
  const folderId = await ensureFolder(folderName);
  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [folderId]
    },
    media: {
      mimeType: file.type || "application/octet-stream",
      body: bufferToStream(buffer)
    },
    fields: "id, webViewLink, webContentLink"
  });

  const driveFileId = response.data.id ?? "";
  return {
    driveFileId,
    previewUrl: response.data.webViewLink ?? `https://drive.google.com/file/d/${driveFileId}/view`,
    downloadUrl: response.data.webContentLink ?? `https://drive.google.com/uc?id=${driveFileId}&export=download`
  };
}

export async function ensureFolder(folderName: string) {
  if (!isDriveConfigured()) return "demo-root-folder";
  const drive = getDriveClient();
  const root = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!;
  const found = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName.replace(/'/g, "\\'")}' and '${root}' in parents and trashed=false`,
    fields: "files(id, name)",
    spaces: "drive"
  });
  const existing = found.data.files?.[0]?.id;
  if (existing) return existing;

  const created = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [root]
    },
    fields: "id"
  });
  return created.data.id ?? root;
}

export async function deleteDriveFile(driveFileId?: string | null) {
  if (!driveFileId || !isDriveConfigured()) return;
  const drive = getDriveClient();
  await drive.files.delete({ fileId: driveFileId });
}

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
