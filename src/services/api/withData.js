import { PureComponent, createElement } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { actionTypes, requestStatuses, resourceReducer } from 'redux-resource';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

// import hoc from './hoc';
import injectReducer from '../../utils/injectReducer';

export default function (resourceType, ids, auto) {
  const resources = isArray(ids) ? ids : [ids];
  const listMode = !resources;
  const requesName = `${resourceType}.list`;

  return (SubComp) => {
    class WithData extends PureComponent {
      componentDidMount() {
        if (auto) setTimeout(this.request);
      }

      request = (skip) => {
        if (!this.checkIsPending()) {
          if (skip || !this.checkIsSuccess()) {
            this.props.dispatch({
              type: actionTypes.READ_RESOURCES_PENDING,
              resourceType,
              resources,
              request: listMode && requesName,
            });
          }
        }
      }

      resync = () => this.request(true)

      checkStatus = (status) => {
        if (listMode) {
          return get(this.props, [resourceType, 'requests', requesName, 'status']) === status;
        }
        return get(this.props, [resourceType, 'meta', resources, 'readStatus']) === status;
      }

      checkIsPending = () => this.checkStatus(requestStatuses.PENDING)

      checkIsSuccess = () => this.checkStatus(requestStatuses.SUCCEEDED)

      render() {
        const data = get(this.props, [resourceType, 'resources']);
        return createElement(SubComp, {
          ...this.props,
          [resourceType]: data,
          resync: this.resync,
          isLoading: this.checkIsPending(),
        });
      }
    }

    const mapStateToProps = (state) => ({
      [resourceType]: state.get(resourceType),
    });

    const withReducer = injectReducer({
      key: resourceType,
      reducer: resourceReducer(resourceType),
    });

    return compose(
      withReducer,
      connect(mapStateToProps),
    )(WithData);
  };
}
