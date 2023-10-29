'use client';

import { forwardRef } from 'react';
import { TextInput } from '~/components';

/**
 * A component that will interface the user and allow him/her
 * to edit a single prop of an entity.
 */
export const EntityValueInput = forwardRef<
    HTMLInputElement,
    {
        isValid: boolean;
        setValue: (value: string | undefined) => void;
        inputType: 'text' | 'textarea';
    } & Pick<
        Omit<React.ComponentProps<typeof TextInput>, 'onChange' | 'ref'>,
        'inputSize' | 'message' | 'placeholder' | 'value'
    >
>(function EntityValueInput(props, ref) {
    const { isValid, message, value, setValue, inputType, inputSize = 'xs', placeholder, ...rest } = props;

    return (
        <TextInput
            ref={ref}
            inputSize={inputSize}
            color={isValid ? undefined : 'error'}
            placeholder={placeholder}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            message={message}
            {...rest}
        />
    );
});
