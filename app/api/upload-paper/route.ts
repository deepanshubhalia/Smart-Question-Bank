\
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import stream from 'stream';

// Configure OAuth2 client
// IMPORTANT: Store these credentials securely, preferably in environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
// This refresh token should be obtained once through an OAuth consent flow
// and stored securely. For service accounts, this is not needed.
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN; 

// The ID of the folder in Google Drive where files will be uploaded
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

async function getAuthenticatedClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    // Use Service Account
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    return google.drive({ version: 'v3', auth });
  } else if (CLIENT_ID && CLIENT_SECRET && REDIRECT_URI && REFRESH_TOKEN) {
    // Use OAuth2
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    // Optional: Refresh the access token if it's expired (googleapis library often handles this)
    // await oAuth2Client.getAccessToken(); 
    return google.drive({ version: 'v3', auth: oAuth2Client });
  } else {
    throw new Error('Google Drive API credentials are not configured. Please set either GOOGLE_SERVICE_ACCOUNT_CREDENTIALS or OAuth2 credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN) in your environment variables.');
  }
}

export async function POST(request: NextRequest) {
  if (!FOLDER_ID) {
    console.error('Google Drive Folder ID is not configured. Please set GOOGLE_DRIVE_FOLDER_ID in your environment variables.');
    return NextResponse.json({ success: false, message: 'Server configuration error: Missing Drive Folder ID.' }, { status: 500 });
  }

  try {
    const drive = await getAuthenticatedClient();
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const subject = data.get('subject') as string || 'Uncategorized';
    const semester = data.get('semester') as string || 'Unknown Semester';
    const branch = data.get('branch') as string || 'Unknown Branch';
    // const examType = data.get('examType') as string || 'Unknown Exam';
    // const year = data.get('year') as string || 'Unknown Year';


    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 });
    }

    // Validate file type (allow PDF and DOCX)
    const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid file type. Only PDF and DOCX are allowed.' }, { status: 400 });
    }
    
    // Construct a more descriptive filename if desired, or use the original
    // const newFileName = `${branch}_${subject}_Sem${semester}_${file.name}`;
    const newFileName = file.name;


    const buffer = Buffer.from(await file.arrayBuffer());
    const readable = new stream.PassThrough();
    readable.end(buffer);

    const fileMetadata = {
      name: newFileName, // Use the original file name or a constructed one
      parents: [FOLDER_ID], // Specify the folder ID here
      // You can add more metadata if needed, like description
      // description: `Uploaded by user X on ${new Date().toISOString()}`, 
    };

    const media = {
      mimeType: file.type,
      body: readable,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name', // Fields to return in the response
    });

    console.log('File Uploaded: ', response.data);

    // Optionally, save metadata to your database here
    // e.g., await saveToDatabase({ fileId: response.data.id, name: response.data.name, uploader: 'userId', timestamp: new Date() });

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully to Google Drive.',
      fileId: response.data.id,
      fileName: response.data.name 
    });

  } catch (error: any) {
    console.error('Error uploading to Google Drive:', error);
    // Check for specific Google API errors if needed
    if (error.response && error.response.data && error.response.data.error) {
        const gError = error.response.data.error;
        return NextResponse.json({ success: false, message: `Google Drive API Error: ${gError.message} (Code: ${gError.code})` }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'Failed to upload file to Google Drive.' }, { status: 500 });
  }
}
