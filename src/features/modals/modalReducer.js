import { createReducer } from "../../app/common/util/reducerUtils";
import { MODAL_OPEN, MODAL_CLOSE } from "./modalConstants";

const initialState = null;

export const openModal = (state, payload) => {
    const {modalType, modalProps} = payload;
    return {modalType, modalProps}
}

export const closeModal = (state, payload) => {
    return null;
}

export default createReducer(initialState, {
    [MODAL_OPEN]: openModal,
    [MODAL_CLOSE]: closeModal
})