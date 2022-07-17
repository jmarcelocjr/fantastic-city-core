import { Controller, Get, Param } from "@nestjs/common";
import { Building } from "src/entities/building.entity";

@Controller('buildings')
export class BuildingController {
    @Get()
    all(): Building[] {
        return [];
    }

    @Get(':id')
    get(@Param('id') id): Building {
        return null;
    }
}