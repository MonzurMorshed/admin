import {NestFactory} from "@nestjs/core";
import {AppModule} from "../app.module";
import { createConnection } from 'typeorm';
import { LinkService } from "./link.service";
import { Link } from "./link";
import { Product } from "src/product/product";
import { OrderItem } from "src/order/order-item";
import { Order } from "src/order/order";

(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const linkService = app.get(LinkService);

    const connection = await createConnection({
        name: 'old',
        type: 'mysql',
        host: 'host.docker.internal',
        port: 33066,
        username: 'root',
        password: 'root',
        database: 'ambassador',
        entities: [Link,Order,Product,OrderItem]
    });

    const links = await connection.manager.find(Link, {
        relations: ['product']
    });

    for (let i = 0; i < links.length; i++) {
        await linkService.save(links[i]);
    }

    process.exit();
})();
