type Digit16 = {
    "a": 10,
    "b": 11,
    "c": 12,
    "d": 13,
    "e": 14,
    "f": 15
}

type Digit16ToDigit10<T extends string> = 
    T extends keyof Digit16
        ? Digit16[T]
        : never

type ConvertDigit16ElementToDigit10<T extends Array<string>, _R extends Array<number> = []> = 
    T extends [infer A extends string, ...infer B extends Array<string>]
        ? ConvertDigit16ElementToDigit10<
            B, 
            [  
                ..._R, 
                A extends `${infer A extends number}` 
                    ? A 
                    : Digit16ToDigit10<Lowercase<A>>
            ]
        >
        : _R

type RemoveFirst<T extends Array<unknown>> = 
    T extends [infer _, ...infer U]
        ? U
        : []

type Split<S extends string, _R extends Array<unknown> = []> = 
    S extends '' 
        ? _R
        : S extends `${infer T}${infer U}`
            ? Split<U, [..._R, T]>
            : never

type Length<T extends Array<unknown> | ReadonlyArray<unknown>> = T['length'];

// I don't like 0
type CheckOdd<T extends number, _R extends Array<number> = [1]> = 
    T extends 0
        ? true
        : Length<_R> extends T
            ? true
            : [1, ..._R]['length'] extends T
                ? false
                : CheckOdd<T, [1, 1, ..._R]>

// Some optimization
type ConvertNumberElementToPixel<T extends Array<number>, _R extends Array<unknown> = []> =
    Length<_R> extends 15
        ? _R
        : CheckOdd<T[Length<_R>]> extends true
            ? ConvertNumberElementToPixel<T, [..._R, "■"]>
            : ConvertNumberElementToPixel<T, [..._R, "□"]>

type Check15OrAbove<T extends Array<unknown>, _R extends Array<unknown> = []> = 
    Length<_R> extends 15
        ? true
        : T extends []
            ? false
            : Check15OrAbove<RemoveFirst<T>, [1, ..._R]>

type MakeIcon<T extends Array<string>> = {
    4: `${T[10]} ${T[5]} ${T[0]} ${T[5]} ${T[10]}`,
    3: `${T[11]} ${T[6]} ${T[1]} ${T[6]} ${T[11]}`,
    2: `${T[12]} ${T[7]} ${T[2]} ${T[7]} ${T[12]}`,
    1: `${T[13]} ${T[8]} ${T[3]} ${T[8]} ${T[13]}`,
    0: `${T[14]} ${T[9]} ${T[4]} ${T[9]} ${T[14]}`,
}

type IdentIcon<T extends string> = 
    Check15OrAbove<Split<T>> extends true 
        ? ConvertDigit16ElementToDigit10<Split<T>> extends Array<number>
            ? MakeIcon<ConvertNumberElementToPixel<ConvertDigit16ElementToDigit10<Split<T>>>>
            : never
        : never

// Try it with 15+ hex chracters
type Icon = IdentIcon<"5a5eb6dfc53b1800769fa3f813528399">