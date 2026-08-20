import { cancellationDeadline, internalReminder } from '../lib/dates';

export type SubStatus = 'active' | 'review_required' | 'cancelling' | 'cancelled';

export type AttentionStatus =
  | 'decision_due'
  | 'review_soon'
  | 'approved_to_renew'
  | 'cancellation_requested';

export interface ActivityEntry {
  label: string;
  date: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  department: string;
  owner: string;
  supplier: string;
  annualCost: number;
  startDate: Date;
  renewalDate: Date;
  noticeDays: number;
  status: SubStatus;
  attentionStatus?: AttentionStatus;
  activity: ActivityEntry[];
  notes?: string;
}

function d(y: number, m: number, day: number): Date {
  return new Date(y, m - 1, day);
}

interface SeedInput {
  id: string;
  name: string;
  category: string;
  department: string;
  owner: string;
  supplier: string;
  annualCost: number;
  startDate: Date;
  renewalDate: Date;
  noticeDays: number;
  status: SubStatus;
  attentionStatus?: AttentionStatus;
  activity?: ActivityEntry[];
  notes?: string;
}

function seed(input: SeedInput): Subscription {
  return { activity: [], ...input };
}

const namedSubscriptions: Subscription[] = [
  seed({
    id: 'autodesk-construction-cloud',
    name: 'Autodesk Construction Cloud',
    category: 'Software',
    department: 'Engineering',
    owner: 'Sarah Hall',
    supplier: 'Autodesk',
    annualCost: 12400,
    startDate: d(2025, 11, 14),
    renewalDate: d(2026, 11, 14),
    noticeDays: 60,
    status: 'review_required',
    attentionStatus: 'decision_due',
    activity: [
      { label: 'Reminder sent', date: '16 Aug 2026' },
      { label: 'Sarah Hall notified', date: '16 Aug 2026' },
      { label: 'Renewal decision awaiting response', date: null },
    ],
  }),
  seed({
    id: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    category: 'Software',
    department: 'IT',
    owner: 'IT Team',
    supplier: 'Adobe',
    annualCost: 8900,
    startDate: d(2025, 12, 1),
    renewalDate: d(2026, 12, 1),
    noticeDays: 60,
    status: 'review_required',
    attentionStatus: 'review_soon',
    activity: [
      { label: 'Reminder sent', date: '02 Aug 2026' },
      { label: 'IT Team notified', date: '02 Aug 2026' },
      { label: 'Renewal decision awaiting response', date: null },
    ],
  }),
  seed({
    id: 'constructionline',
    name: 'Constructionline',
    category: 'Compliance',
    department: 'Compliance',
    owner: 'James Cole',
    supplier: 'Constructionline',
    annualCost: 3250,
    startDate: d(2025, 12, 18),
    renewalDate: d(2026, 12, 18),
    noticeDays: 60,
    status: 'review_required',
    attentionStatus: 'review_soon',
    activity: [
      { label: 'Reminder sent', date: '19 Aug 2026' },
      { label: 'James Cole notified', date: '19 Aug 2026' },
      { label: 'Renewal decision awaiting response', date: null },
    ],
  }),
  seed({
    id: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'IT',
    department: 'IT',
    owner: 'IT Team',
    supplier: 'Microsoft',
    annualCost: 36000,
    startDate: d(2026, 1, 5),
    renewalDate: d(2027, 1, 5),
    noticeDays: 60,
    status: 'active',
    attentionStatus: 'approved_to_renew',
    activity: [
      { label: 'Reminder sent', date: '07 Nov 2026' },
      { label: 'IT Team notified', date: '07 Nov 2026' },
      { label: 'Renewal approved', date: '10 Nov 2026' },
    ],
  }),
  seed({
    id: 'dropbox-business',
    name: 'Dropbox Business',
    category: 'Software',
    department: 'Marketing',
    owner: 'Marketing',
    supplier: 'Dropbox',
    annualCost: 2400,
    startDate: d(2026, 1, 22),
    renewalDate: d(2027, 1, 22),
    noticeDays: 60,
    status: 'cancelling',
    attentionStatus: 'cancellation_requested',
    activity: [
      { label: 'Reminder sent', date: '24 Nov 2026' },
      { label: 'Marketing notified', date: '24 Nov 2026' },
      { label: 'Cancellation requested', date: '26 Nov 2026' },
    ],
  }),
  seed({
    id: 'microsoft-azure',
    name: 'Microsoft Azure',
    category: 'IT',
    department: 'IT',
    owner: 'J. Smith',
    supplier: 'Microsoft',
    annualCost: 16200,
    startDate: d(2026, 3, 12),
    renewalDate: d(2027, 3, 12),
    noticeDays: 60,
    status: 'active',
    activity: [
      { label: 'Reminder sent', date: '11 Jan 2027' },
      { label: 'J. Smith notified', date: '11 Jan 2027' },
    ],
  }),
  seed({
    id: 'zoom-business',
    name: 'Zoom Business',
    category: 'Software',
    department: 'IT',
    owner: 'IT Team',
    supplier: 'Zoom',
    annualCost: 1800,
    startDate: d(2026, 1, 30),
    renewalDate: d(2027, 1, 30),
    noticeDays: 30,
    status: 'active',
    activity: [
      { label: 'Reminder sent', date: '01 Dec 2026' },
      { label: 'IT Team notified', date: '01 Dec 2026' },
    ],
  }),
];

const fillerVendors = [
  'Salesforce Cloud', 'Slack Enterprise', 'Atlassian Suite', 'HubSpot Marketing',
  'DocuSign', 'Xero Accounting', 'Sage Payroll', 'Figma Organisation',
  'Notion Teams', 'Miro Business', 'Zendesk Support', 'Okta Identity',
  'Asana Premium', 'Trello Business', 'GitHub Enterprise', 'GitLab Ultimate',
  'AWS Reserved', 'Google Workspace', 'Mailchimp Standard', 'Canva Teams',
  'LinkedIn Recruiter', 'Indeed Sponsored', 'Bright HR', 'CIPS Membership',
  'RICS Membership', 'Procore Construction', 'PlanGrid', 'Bluebeam Revu',
  'Sage Estimating', 'Causeway Tas', 'Trimble Connect', 'BIM 360',
  'Xactimate', 'Fieldwire', 'SafetyCulture', 'Avetta Compliance',
  'CHAS Accreditation', 'Achilles Verify', 'Constructline Plus', 'NBS Chorus',
  'Causeway CATO', 'Eque2 Contract', 'COINS Payroll', 'Viewpoint Vista',
  'Zutec Handover', 'Fonn Site', 'Raken Reporting', 'Buildertrend',
  'CoConstruct', 'RSMeans Data', 'PlanSwift', 'Stack Takeoff', 'Bluebeam Studio',
];

const categories = ['Software', 'IT', 'Compliance', 'Marketing', 'Finance'];
const departments = ['IT', 'Engineering', 'Finance', 'Marketing', 'Compliance'];
const owners = ['J. Smith', 'S. Hall', 'IT Team', 'Finance Team', 'J. Cole', 'M. Ahmed', 'R. Patel', 'L. Nguyen'];

function generateFiller(count: number, status: SubStatus, offset: number): Subscription[] {
  const list: Subscription[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (offset + i) % fillerVendors.length;
    const name = fillerVendors[idx];
    const category = categories[(offset + i) % categories.length];
    const department = departments[(offset + i * 3) % departments.length];
    const owner = owners[(offset + i * 2) % owners.length];
    const cost = 900 + ((offset + i) * 733) % 22000;
    const renewalMonth = ((offset + i * 5) % 12) + 1;
    const renewalDay = ((offset + i * 7) % 27) + 1;
    const renewalYear = status === 'cancelled' ? 2026 : 2026 + (renewalMonth <= 8 ? 1 : 0);
    const startYear = renewalYear - 1;
    list.push(
      seed({
        id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${offset + i}`,
        name,
        category,
        department,
        owner,
        supplier: name.split(' ')[0],
        annualCost: cost,
        startDate: d(startYear, renewalMonth, renewalDay),
        renewalDate: d(renewalYear, renewalMonth, renewalDay),
        noticeDays: [30, 60, 90][(offset + i) % 3],
        status,
        activity: [{ label: 'Reminder sent', date: null }],
      }),
    );
  }
  return list;
}

export const subscriptions: Subscription[] = [
  ...namedSubscriptions,
  ...generateFiller(39, 'active', 0),
  ...generateFiller(1, 'review_required', 39),
  ...generateFiller(2, 'cancelling', 40),
  ...generateFiller(9, 'cancelled', 42),
];

export function getDeadline(sub: Subscription): Date {
  return cancellationDeadline(sub.renewalDate, sub.noticeDays);
}

export function getReminder(sub: Subscription): Date {
  return internalReminder(getDeadline(sub));
}

export const attentionList = namedSubscriptions.filter((s) => s.attentionStatus);

export const departmentSpend = [
  { department: 'IT', amount: 96250 },
  { department: 'Engineering', amount: 45600 },
  { department: 'Finance', amount: 24100 },
  { department: 'Marketing', amount: 18300 },
];

export const kpis = {
  annualCost: 184250,
  activeSubscriptions: 42,
  cancelledThisYear: 6,
  decisionsRequired: 4,
};
