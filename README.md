# Generic-Rest-Express-Lib

Lib for API Rest developed using *NodeJs*. Its purpose is to serve as a lib to make it easier to provide and serve data with Sequelize from any API that uses it as a framework.


## Setting up

Import the dependency on your project. POC example https://github.com/LeonardoRamos/node-generic-rest-api.

```javascript
"dependencies": {
        "generic-rest-express-lib": "1.0.0",
        .
        .
        .
```

Create a config file for setting up database with root base path of your application so sequelize can setup your domain models from domain's path:

```javascript
import { db } from 'generic-rest-express-lib';
import path from 'path';

db.loadModels(__dirname).forEach((modelFile) => {
    const model = db.sequelize.import(modelFile);
    db[model.name] = model;
});

db.syncModels();

export default db;
```  

Define your applications routes (note, a health check endpoint will be added on `/manage/health` and if you use your application package.json information as parameter on setup, a `/manage/info` route will also be added):

```javascript
import appPackage from '../../../package.json';
import authRoute from '../route/auth.route';
import apiRoutes from '../route/api/api.route';
import { app } from 'generic-rest-express-lib';

app.use('/auth', authRoute);
app.use('/v1', apiRoutes);

app.setupApp(appPackage);

export default app;
``` 

#### Creating API entities (entities with the following mandatory fields: id; externalId; insertDate; updateDate; deleteDate; active)

- #### Entity layer

```javascript
import { BaseApiEntity, db } from 'generic-rest-express-lib';

class UserDefinition extends BaseApiEntity { 
    constructor() {
        super();
    .
    .
    .
}

const userDefinition = new UserDefinition();

module.exports = (sequelize) => {
    const User = sequelize.define('User', userDefinition, {
        tableName: 'user',
        timestamps: false
    });
    .
    .
    .

    User.prototype.toJSON = userDefinition.toJSON;

    return User;
};

```

- #### Service layer

```javascript
import { BaseApiRestService } from 'generic-rest-express-lib';
import db from '../config/sequelize';

const User = db.User;

module.exports = class UserService extends BaseApiRestService {
    
    constructor() {
        super(User);
    }
}
```

- #### Controller layer

```javascript
import { BaseApiRestController } from 'generic-rest-express-lib';
import UserService from '../service/user.service';

const userService = new UserService();

module.exports = class UserController extends BaseApiRestController {
    
    constructor() {
        super(userService);
    }
}
```

- #### Route layer

```javascript
import express from 'express';
import UserController from '../controller/user.controller';

const router = express.Router();
const userController = new UserController();

router
    .route('/users')
    .get(userController.list)
    .post(userController.insert);

router
    .route('/users/:externalId')
    .get(userController.get)
    .put(userController.update)
    .delete(userController.remove);

router.param('externalId', userController.getByExternalId);

export default router;
```

#### Creating Basic entities (entities with field primary key ID)

- #### Entity layer

```javascript
import { BaseEntity, db } from 'generic-rest-express-lib';

class CarDefinition extends BaseEntity { 
    constructor() {
        super();
    .
    .
    .
}

const carDefinition = new CarDefinition();

module.exports = (sequelize) => {
    const Car = sequelize.define('Car', carDefinition, {
        tableName: 'car',
        timestamps: false
    });
    .
    .
    .

    Car.prototype.toJSON = carDefinition.toJSON;

    return Car;
};

```

- #### Service layer

```javascript
import { BaseRestService } from 'generic-rest-express-lib';
import db from '../config/sequelize';

const Car = db.Car;

module.exports = class CarService extends BaseRestService {
    
    constructor() {
        super(Car);
    }
}
```

- #### Controller layer

```javascript
import { BaseRestController } from 'generic-rest-express-lib';
import CarService from '../service/car.service';

const carService = new CarService();

module.exports = class CarController extends BaseRestController {
    
    constructor() {
        super(carService);
    }
}
```

- #### Route layer

```javascript
import express from 'express';
import CarController from '../controller/car.controller';

const router = express.Router();
const carController = new CarController();

router
    .route('/cars')
    .get(carController.list)
    .post(carController.insert);

router
    .route('/users/:id')
    .get(carController.get)
    .put(carController.update)
    .delete(carController.remove);

router.param('id', carController.getById);

export default router;
```

Example of env vars:

```
NODE_ENV=development
PORT=9503
JWT_SECRET=0a6b944d-d2fb-46fc-a85e-0295c986cd9f
JWT_EXPIRATION=86000
DB_DATABASE=TestNode
DB_DIALECT=postgres
DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
SCAN_MODEL_PATH=/domain
LOG_FILE=/var/log/node/GenericRestExpressLib/genericRestExpressLib.log
```

## API

The API accepts filters, sorting, aggregation functions, grouping and field projection.
For authentications, it uses JWT.


### Filter
The available options of filters to be applied:

- Equals: "=eq=" or "=" (may be used to compare if value is equal to `null`)

- Less than or equal: "=le=" or "<="

- Greater than or equal: "=ge=" or ">="

- Greater than: "=gt=" or ">"

- Less than: "=lt=" or "<"

- Not equal: "=ne=" or "!=" (may be used to compare if the value is other than `null`)

- In: "=in="

- Out: "=out="

- Like: "=like="

Logical operators in the url:

- AND: "\_and\_" or just ";"
- OR: "\_or\_" or just ","


`filter = [field1=value,field2=like=value2;field3!=value3...]`

### Projection
The Projection follows the following syntax, and the json response will only have with the specified fields:

`projection = [field1, field2, field3...]`

### Sort
The Sorting follows the following syntax (where `sortOrder` may be `asc` or `desc`):

`sort = [field1 = sortOrder, field2 = sortOrder...]`

### GroupBy
GroupBy follows the following syntax (*groupBy* does not accept *projections* parameters and is expected to be used along with an aggregation function):

`groupBy = [field1, field2, field3...]`

### Sum
It performs Sum function in the specified fields, and follows the following syntax:

`sum = [field1, field2, field3...]`

### Avg
It performs function of Avg in the specified fields, and follows the following syntax:

`avg = [field1, field2, field3...]`

### Count
It performs Count function in the specified fields, and follows the following syntax:

`count = [field1, field2, field3...]`

### Count Distinct
It performs Count Distinct function in the specified fields, and follows the following syntax:

`countDistinct = [field1, field2, field3...]`

### Error response format

```json
{
   "errors":[
      {
         "code":"ERROR_CODE",
         "message":"Error parsing projections of filter [unknownField]"
      }
   ]
}
```

### Extra Parameters
- offset (DEFAULT_OFFSET = 0)
- limit (DEFAULT_LIMIT = 20 and MAX_LIMIT = 100)

