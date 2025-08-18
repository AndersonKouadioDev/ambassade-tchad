export const getEnumOptions = <T extends Object>({
    enumData,
    t,
    namespace,
}: {
    enumData: T;
    t: (key: string) => string;
    namespace?: string;
}) => {
    return Object.values(enumData).map((value) => ({
        value,
        label: namespace ? t(`${namespace}.${value}`) : t(value),
    }));
};