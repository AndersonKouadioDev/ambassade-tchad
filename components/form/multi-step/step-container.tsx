import React, {PropsWithChildren} from 'react';

function StepContainer({title,...props}: PropsWithChildren<{title: string}>) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            {props.children}
        </div>
    );
}

export default StepContainer;