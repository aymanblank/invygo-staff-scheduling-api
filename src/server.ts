import App from './app';
import { IndexRoute, AuthRoute, UserRoute, ScheduleRoute } from './api/routes';
import { validateEnv } from './utils';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new UserRoute(), new ScheduleRoute()]);

app.listen();
