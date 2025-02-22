import fz from '../converters/fromZigbee';
import tz from '../converters/toZigbee';
import * as exposes from '../lib/exposes';
import {deviceEndpoints, onOff} from '../lib/modernExtend';
import * as reporting from '../lib/reporting';
import {DefinitionWithExtend} from '../lib/types';

const e = exposes.presets;

const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ['GWA1502_BinaryInput230V'],
        model: 'GWA1502_BinaryInput230V',
        vendor: 'Gewiss',
        description: 'Automatically generated definition',
        extend: [deviceEndpoints({"endpoints":{"1":1,"2":2}}), identify(), occupancy(), commandsOnOff({"endpointNames":["1","2"]}), commandsLevelCtrl({"endpointNames":["1","2"]}), commandsWindowCovering({"endpointNames":["1","2"]})],
        meta: {"multiEndpoint":true},
    },    
    {
        zigbeeModel: ['GWA1521_Actuator_1_CH_PF'],
        model: 'GWA1521',
        description: 'Switch actuator 1 channel with input',
        vendor: 'Gewiss',
        extend: [onOff()],
    },
    {
        zigbeeModel: ['GWA1522_Actuator_2_CH'],
        model: 'GWA1522',
        description: 'Switch actuator 2 channels with input',
        vendor: 'Gewiss',
        extend: [deviceEndpoints({endpoints: {l1: 1, l2: 2}}), onOff({endpointNames: ['l1', 'l2']})],
    },
    {
        zigbeeModel: ['GWA1531_Shutter'],
        model: 'GWA1531',
        description: 'Shutter actuator',
        vendor: 'Gewiss',
        fromZigbee: [fz.cover_position_tilt, fz.ignore_basic_report],
        toZigbee: [tz.cover_state, tz.cover_position_tilt],
        meta: {coverInverted: true},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['closuresWindowCovering']);
            await reporting.currentPositionLiftPercentage(endpoint);
        },
        exposes: [e.cover_position()],
    },
];

export default definitions;
module.exports = definitions;
