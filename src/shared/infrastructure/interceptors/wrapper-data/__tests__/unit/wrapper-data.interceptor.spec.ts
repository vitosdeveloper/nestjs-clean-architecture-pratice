import { of } from 'rxjs';
import { DataInterceptorWrapper } from '../../wrapper-data.interceptor';

describe('DataInterceptorWrapper', () => {
  let interceptor: DataInterceptorWrapper;
  let props: any;
  beforeEach(() => {
    interceptor = new DataInterceptorWrapper();
    props = {
      name: 'Test name',
      emailk: 'a@a.com',
      password: 'fake-pass',
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should have the data key', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });

    obs$.subscribe({
      next: (value) => {
        expect(value).toEqual({ data: props });
      },
    });
  });

  it('shouldnt have the data key when the meta key is defined', () => {
    const result = { data: [props], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$.subscribe({
      next: (value) => {
        expect(value).toEqual(result);
      },
    });
  });
});
