import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import * as moment from "moment";
import { Building } from "src/entities/building.entity";

@Injectable()
export class BuildingService {
    recharge(building: Building): number {
        if (!building.properties.builded) {
            throw new BadRequestException('Not Builded Yet');
        }

        this.check(building);

        if (building.properties.current_charge == Building.MAX_CHARGE) {
            throw new BadRequestException('Already charged');
        }

        let time = moment(building.properties.builded_at ?? 'now');
        time.add(Building.HOURS_PER_CHARGE, 'hours');
        
        let current_charge = Math.ceil((time.toDate().getTime() - (new Date()).getTime()) / 1000 / 60 / 60 / Building.HOURS_PER_CHARGE);

        building.properties = {
            ...building.properties,
            charged_until: time.toDate(),
            current_charge: current_charge
        };

        return building.properties.reward_per_charge;
    }

    check(building: Building): boolean {
        return this.checkEnergy(building);
    }

    private checkEnergy(building: Building): boolean {
        if ((building.properties.current_charge ?? 0) == 0) {
            return false;
        }

        let diff = (building.properties.charged_until.getTime() - (new Date()).getTime());

        let current_charge = Math.ceil(diff / 1000 / 60 / 60 / Building.HOURS_PER_CHARGE);
        current_charge = Math.max(current_charge, 0);

        let changed = current_charge != building.properties.current_charge;
        building.properties.current_charge = current_charge;

        if (current_charge == 0) {
            building.properties.charged_until = null;
        }

        return changed;
    }
}