import { Client } from '@opensearch-project/opensearch';

export const opensearch = new Client({
  node: process.env.OPENSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.OPENSEARCH_USERNAME || 'admin',
    password: process.env.OPENSEARCH_PASSWORD || 'admin',
  },
});

export const checkOpenSearchConnection = async () => {
  try {
    const info = await opensearch.info();
    console.log('Connected to OpenSearch:', info.body.version.distribution);
    return true;
  } catch (error) {
    console.error('Failed to connect to OpenSearch:', error);
    return false;
  }
};
