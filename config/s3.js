const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// S3 folder configuration
const S3_FOLDERS = {
  articles: 'articles/',
  carousel: 'carousel/',
  categories: 'categories/',
  heroContent: 'hero-content/',
  items: 'items/',
  uploads: 'uploads/',
  testCategories: 'test-categories/',
  test: 'test/',
  general: 'general/', // Default folder for uploads
  advertisements: 'advertisements/' // Advertisement images
};

// Upload file to S3
const uploadToS3 = async (file, folder, userId) => {
  try {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}_${userId}_${randomString}_${file.originalname}`;
    const key = `${S3_FOLDERS[folder]}${fileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // Removed due to ACL restrictions on bucket
      Metadata: {
        uploadedBy: userId.toString(),
        uploadDate: new Date().toISOString(),
        originalName: file.originalname
      }
    };

    const result = await s3.upload(params).promise();

    return {
      file_key: key,
      file_url: result.Location,
      file_name: fileName,
      file_size: file.size,
      mime_type: file.mimetype
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

// Delete file from S3
const deleteFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};

// Get signed URL for private files
const getSignedUrl = async (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn
    };

    return await s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    console.error('S3 signed URL error:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

// List files in a folder
const listFiles = async (folder, maxKeys = 1000) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: S3_FOLDERS[folder] || folder,
      MaxKeys: maxKeys
    };

    const result = await s3.listObjectsV2(params).promise();

    return result.Contents.map(item => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`
    }));
  } catch (error) {
    console.error('S3 list files error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

// Copy file within S3
const copyFile = async (sourceKey, destinationKey) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      CopySource: `${process.env.S3_BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
      ACL: 'public-read'
    };

    await s3.copyObject(params).promise();

    return {
      key: destinationKey,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${destinationKey}`
    };
  } catch (error) {
    console.error('S3 copy file error:', error);
    throw new Error(`Failed to copy file: ${error.message}`);
  }
};

// Get file metadata
const getFileMetadata = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey
    };

    const result = await s3.headObject(params).promise();

    return {
      key: fileKey,
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
      metadata: result.Metadata
    };
  } catch (error) {
    console.error('S3 metadata error:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

module.exports = {
  s3,
  S3_FOLDERS,
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
  listFiles,
  copyFile,
  getFileMetadata
};
