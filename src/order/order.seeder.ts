import {NestFactory} from "@nestjs/core";
import {AppModule} from "../app.module";
import { createConnection } from 'typeorm';
import { Link } from "src/link/link";
import { Order } from "src/order/order";
import { Product } from "src/product/product";
import { OrderItem } from "src/order/order-item";
import { OrderService } from "./order.service";

(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const orderService = app.get(OrderService);

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

    const orders = await connection.manager.find(Order, {
        relations: ['order_item']
    });

    for (let i = 0; i < orders.length; i++) {
        await orderService.save(orders[i]);
    }

    process.exit();
})();
