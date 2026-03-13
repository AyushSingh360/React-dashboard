export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'
];

export const DUMMY_EMPLOYEES = [
  { id: '101', name: 'Arjun Mehta', designation: 'Software Engineer', city: 'Mumbai', salary: '85000' },
  { id: '102', name: 'Priya Sharma', designation: 'Senior Developer', city: 'Delhi', salary: '120000' },
  { id: '103', name: 'Rahul Nair', designation: 'Product Manager', city: 'Bangalore', salary: '150000' },
  { id: '104', name: 'Ananya Iyer', designation: 'UI/UX Designer', city: 'Chennai', salary: '95000' },
  { id: '105', name: 'Vikram Singh', designation: 'DevOps Engineer', city: 'Pune', salary: '110000' },
  { id: '106', name: 'Sanya Gupta', designation: 'Data Scientist', city: 'Hyderabad', salary: '135000' },
  { id: '107', name: 'Amit Das', designation: 'Backend Lead', city: 'Kolkata', salary: '145000' },
  { id: '108', name: 'Neha Reddy', designation: 'QA Engineer', city: 'Bangalore', salary: '75000' },
  { id: '109', name: 'Siddharth Joshi', designation: 'Mobile Developer', city: 'Mumbai', salary: '90000' },
  { id: '110', name: 'Pooja Varma', designation: 'HR Manager', city: 'Ahmedabad', salary: '80000' },
  // Generate more for virtualization testing
  ...Array.from({ length: 90 }, (_, i) => ({
    id: (200 + i).toString(),
    name: ['Rohan', 'Karan', 'Simran', 'Ishaan', 'Tanvi'][i % 5] + ' ' + ['Patel', 'Kapoor', 'Malhotra', 'Bose', 'Rao'][i % 5],
    designation: ['Developer', 'Manager', 'Analyst', 'Lead'][i % 4],
    city: INDIAN_CITIES[i % INDIAN_CITIES.length],
    salary: (60000 + (i * 1000)).toString()
  }))
];

export const DUMMY_AUDITS = [
  {
    id: 'AUD-1710342000000',
    employeeId: '101',
    employeeName: 'Arjun Mehta',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    image: '/mock-audits/audit_1.png'
  },
  {
    id: 'AUD-1710345600000',
    employeeId: '102',
    employeeName: 'Priya Sharma',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    image: '/mock-audits/audit_2.png'
  }
];
