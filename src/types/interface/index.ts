import Ability from "./ability.interface";
import Abilities from "./abilities.interface";
import Library from "./library.interface";
import { ModelProps } from "./model-props.interface";
import {GLTF} from 'three-stdlib';
import Board from "./board.interface";
import User, { UserMember, UserGuest }  from "./user.interface";

export type {
    Ability,
    Abilities,
    Library,
    ModelProps,
    Board,
    User,
    UserMember,
    UserGuest
}

export type GLTFResult = GLTF & {
    nodes: any;
    materials: any;
}