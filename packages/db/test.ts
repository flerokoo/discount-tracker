import dataSource from "./data-source";
import { Price } from "./models/Price";
import { Product } from "./models/Product";
import { User } from "./models/User";
import { TypeOrmUserRepository } from "./repositories/TypeOrmUserRepository";

(async () => {
  await dataSource.initialize();
  await dataSource.synchronize(true);

  const myrepo = new TypeOrmUserRepository(dataSource)
  

  const userRepo = dataSource.getRepository(User)
  const prodRepo = dataSource.getRepository(Product);
  const priceRepo = dataSource.getRepository(Price);

  const prod = prodRepo.create();
  prod.imageUrl = 'http://someimage'
  prod.url = 'http//product url'



  const user = userRepo.create();
  user.email = 'privet@email.cm'
  user.password = '123'
  user.products = [prod]
  await userRepo.save(user);

  userRepo.save(user)

  console.log(await userRepo.find({ relations : { products: true }}))
  console.log(await myrepo.select({}, true))
})();
