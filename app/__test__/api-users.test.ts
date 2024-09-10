import { loader } from '../routes/api.users';

const url = `http://localhost:3000/api/users`;
const mockUsersData = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    birth_year: '19BBY',
    gender: 'male',
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
  },
  {
    name: "Owen Lars",
    height: "178",
    mass: "120",
    hair_color: "brown, grey",
    birth_year: "52BBY",
    gender: "male",
    created: "2014-12-10T15:52:14.024000Z",
    edited: "2014-12-20T21:17:50.317000Z",
  }
];
const loaderArgs = { request: {}, context: {}, params: {} };

// fetch API mocks
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('user api loader', () => {
  let mockRequest: Request;

  beforeEach(() => {
    mockRequest = new Request(url);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  })

  it('should render list of users', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: mockUsersData }),
    });

    mockRequest = new Request(url);
    const result = await loader({ ...loaderArgs, request: mockRequest });
    const data = await (result as Response).json();

    expect((result as Response).status).toEqual(200);
    expect(data.results.length).toEqual(mockUsersData.length);
  });

  it('should render list of users that matches search keyword', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ results: [mockUsersData[1]] }),
    });

    const searchKeyword = 'Owen Lars';
    const mockRequest = new Request(`${url}?search=${searchKeyword}`);

    const result = await loader({ ...loaderArgs, request: mockRequest });
    const data = await (result as Response).json();

    expect((result as Response).status).toEqual(200);
    expect(data.results[0].name).toEqual(searchKeyword);
  });

  it('should throw a 500 error if the API call fails', async () => {
    mockFetch.mockRejectedValueOnce({
      ok: false,
      status: 500,
      messaage: 'Internal Server Error',
    });

    try {
      await loader({ ...loaderArgs, request: mockRequest });
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.messaage).toBe("Internal Server Error");
    }

  });

  it("should log the error when the API call fails", async () => {
    const apiError = new Error("API Error");
    mockFetch.mockRejectedValue(apiError);

    console.error = jest.fn();

    await expect(loader({ request: mockRequest, params: {}, context: {} } as any)).rejects.toThrow();
    expect(console.error).toHaveBeenLastCalledWith("Failed to get users list: ", apiError);
  });
});
