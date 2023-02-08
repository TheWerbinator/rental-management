import * as _ from "lodash-es";
import { writeFileSync } from "fs";
import { faker } from "@faker-js/faker";
const { capitalize, range, sample } = _;

const userAmount = 2;
const equipmentAmount = 5;

const db = {
  users: range(userAmount).map((_, id) => ({
    name: `${capitalize(faker.name.firstName())}`,
    email: faker.internet.email(),
    password: "asdf123!",
    phone: faker.random.words(sample([8, 5, 7])),
    payment: {
      nameOnCard: '',
      cardNumber: '',
      exp: '',
      securityCode: '',
    },
    id,
  })),
  equipment: range(equipmentAmount).map((_, id) => ({
    name: `${capitalize(faker.name.firstName())}`,
    description: faker.random.words(sample([8, 5, 7])),
    isRented: false,
    id,
  })),
  savedForLater: [
    
  ],
  activeRentals: [
    
  ],
};

writeFileSync("db.json", JSON.stringify(db), { encoding: "utf-8" });
