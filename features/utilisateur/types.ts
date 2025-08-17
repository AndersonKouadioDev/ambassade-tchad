import type {createTranslator, Messages} from "next-intl";
import {Dispatch, SetStateAction} from "react";
import {FieldApi, FieldComponent} from "@tanstack/react-form";

export type TFunction = ReturnType<typeof createTranslator<Messages>>;

export type SetActiveTabType = Dispatch<SetStateAction<'view' | 'edit' | 'password'>>;
export type ActiveTabType = 'view' | 'edit' | 'password';
export type TanstackField = FieldComponent<any, any, any, any, any, any, any, any, any, any, any, any>;
export type SetShowPassword = Dispatch<SetStateAction<{
    current: boolean
    new: boolean
    confirm: boolean
    edit: boolean
}>>

export type tanstackFieldApi = FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;