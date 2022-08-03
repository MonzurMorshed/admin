import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';
import {LinkService} from "./link.service";
import {AuthGuard} from "../user/auth.guard";

@UseGuards(AuthGuard)
@Controller()
export class LinkController {
    constructor(
        private linkService: LinkService
    ) {
    }

    @Get('/users/:id/links')
    async all(@Param('id') id: number) {
        return this.linkService.find({
            user: id,
            relations: ['orders','orders.order_items']
        });
    }

}
