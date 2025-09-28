
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import identityController from './modules/identity/identity.controller';
import organizationsController from './modules/organizations/organizations.controller';
import issuesController from './modules/project-management/issues.controller';
import pagesController from './modules/knowledge-base/pages.controller';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/identity', identityController);
app.use('/api/v1/orgs', organizationsController);
app.use('/api/v1', issuesController);
app.use('/api/v1', pagesController);

export default app;
