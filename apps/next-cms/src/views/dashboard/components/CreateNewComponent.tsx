import { AwesomeIcon } from '~/components';

export function CreateNewComponentFab() {
    return (
        <div className="tooltip tooltip-left" data-tip="Create new">
            <button className="btn btn-accent">
                <AwesomeIcon icon="hand-middle-finger" />
            </button>
        </div>
    );
}

export function CreateNewComponent() {
    return <></>;
}

CreateNewComponent.Fab = CreateNewComponentFab;
