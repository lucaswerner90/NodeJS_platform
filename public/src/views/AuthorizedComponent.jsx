import React, {Component, PropTypes} from 'react';
import { render }   from 'react-dom';
import { connect, Provider  } from 'react-redux';
import { push } from 'react-router-redux';

export default function requiresAuth(Component) {
    class AuthenticatedComponent extends React.Component {
        constructor(props) {
            super(props);
        };

        static get propTypes() {
            return {
                state: PropTypes.object.isRequired,
                dispatch: PropTypes.func.isRequired
            }
        };

        componentDidMount() {
            this._checkAndRedirect();
        };

        componentDidUpdate() {
            this._checkAndRedirect();
        };

        _checkAndRedirect() {
            const { dispatch, user } = this.props;
            const { role, redirectTo }  = options;
            const store = createStore(reducer);

            if (!user || !user.role === role) {
                dispatch(push(redirectTo || '/login'));
            }
        };

        render() {
            return (
                <div className="authenticated">
                    { this.props.user ? <Component {...this.props}  /> : null }
                </div>
            );
        }
    }
    const mapStateToProps = (state) => {
        return {
            user: state.account.user
        };
    };

    return connect(mapStateToProps)(AuthenticatedComponent);

}
