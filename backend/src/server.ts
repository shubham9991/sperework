import app from './app';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
