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

#### Creating API entities (entities with the following mandatory fields: id; externalId; insertDate; updateDate; deleteDate; active)

- #### Entity layer

```javascript
import Sequelize from 'sequelize';
import BaseEntity from './core/base.entity';

class UserDefinition extends BaseEntity { 
    .
    .
    .
}

const userDefinition = new UserDefinition();

module.exports = (sequelize) => {
    .
    .
    .

    User.prototype.toJSON = userDefinition.toJSON;

    return User;
};

```

- #### Service layer

```javascript
import ApiRestService from './core/api.rest.service';
import db from '../config/sequelize';

const User = db.User;

module.exports = class UserService extends ApiRestService {
    
    constructor() {
        super(User);
    }

```

- #### Controller layer

```javascript
import ApiRestController from './core/api.rest.controller';
import UserService from '../service/user.service';

const userService = new UserService();

module.exports = class UserController extends ApiRestController {
    
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
const paramValidation = userController.paramValidation();

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

