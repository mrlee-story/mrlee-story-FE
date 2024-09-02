import React from "react";

export interface ModelProps extends React.ComponentPropsWithRef<'group'> {
    animation?: string;
    wireframe?: boolean;

    section?:number;
    copySection?:number;
    isMobile?:boolean;
}