import React from "react";

function WelcomeModal({ name, onClose }) {
    return (
        <div
            className="modal"
            style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Welcome Back</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Welcome back, {name}!</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeModal;
