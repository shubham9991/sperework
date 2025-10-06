import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import AWS from 'aws-sdk';

const presignSchema = z.object({
  bucket: z.string().min(1),
  key: z.string().min(1),
  contentType: z.string().min(1)
});

export async function s3Routes(app: FastifyInstance) {
  app.post('/attachments/presign', { preHandler: [app.authenticate as any] }, async (req, reply) => {
    const parsed = presignSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid payload' });
    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION
    });
    const params = {
      Bucket: parsed.data.bucket,
      Key: parsed.data.key,
      ContentType: parsed.data.contentType,
      Expires: 300
    };
    const url = await s3.getSignedUrlPromise('putObject', params);
    return { url };
  });
}
