/**
 * @author <Vinayak.S>
 * @description URL constants
 * @copyright Supra software solutions, inc
 */
export namespace URLConstants {
  export const HTTP_URL_LOGIN = '/v1/login';
  export const HTTP_URL_GET_REQUESTS = '/v1/requests';
  export const HTTP_URL_INTERPRETERS = '/v1/interpreters';
  export const HTTP_URL_PARTNERS = '/v1/partners';
  export const HTTP_URL_LANGUAGES = '/v1/languages';
  export const HTTP_URL_RESOURCE = '/v1/resources';
  export const HTTP_URL_REQUESTS = '/v1/requests';
  export const HTTP_URL_PAYOUTS = '/v1/payouts';
  export const HTTP_URL_CHANGE_PASSWORD = '/v1/changePassword';
  export const HTTP_URL_MEETING = '/v1/meetings';
  export const URL_INTERPRETERSID = 'interpreters/:interpreterId';
  export const URL_VIEW_CERTITIFICATE =
    'interpreters/:interpreterId/certificates/:id';
  export const HTTP_URL_USERS = '/v1/users';
  export const HTTP_URL_ROUTES = '/v1/routes';
  export const HTTP_URL_TRANSPORTERS = '/v1/transporters';
}

// ${URLConstants.URL_ROUTE}/:requestId/:routeId/location
// `${MedTransGoConstants.HTTP_URL_ROUTES}/${requestId}/${routeId}/start`
