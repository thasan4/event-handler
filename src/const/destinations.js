export default [
  {
    name: 'destination1',
    transport: 'http.get',
    url: 'http://localhost:8000/destination1',
  },
  {
    name: 'destination2',
    transport: 'http.post',
    url: 'http://localhost:8000/destination2',
  },
  {
    name: 'destination3',
    transport: 'console.log'
  },
  {
    name: 'destination4',
    transport: 'console.warn'
  },
];
