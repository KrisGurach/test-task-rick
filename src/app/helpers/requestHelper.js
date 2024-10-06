export class RequestHelper {
  static formRequestsWithPage = (callback, props, initialPage, pageCount) => {
    let requests = [];

    for (let i = initialPage; i <= pageCount; i++) {
      const request = callback({ ...props, page: i });
      requests.push(request);
    }

    return requests;
  };
}
