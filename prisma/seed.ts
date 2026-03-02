import { prisma } from '../lib/prisma';

const ownerNames = ['Alice Carter','Ben Hughes','Chloe Patel','Daniel Wright','Emma Green','Farah Ali','George Bell','Hannah Jones','Ian Cooper','Jade Morgan'];
const nonOwnerNames = ['Karl Smith','Laura Brown','Mike Davies','Nina Shah','Owen Clark','Priya Raman','Quentin Hall','Rachel Evans','Sam Turner','Tina Walsh','Umar Khan','Vicky Scott','Will Adams','Xenia Long','Yusuf Ahmed','Zoe Miller','Aaron Fox','Bianca Reed','Callum Price','Daisy Wood'];

async function main() {
  await prisma.bayAssignment.deleteMany();
  await prisma.officeRequest.deleteMany();
  await prisma.movement.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.setting.upsert({ where: { key: 'owner_cutoff_hhmm' }, update: { value: '18:00' }, create: { key: 'owner_cutoff_hhmm', value: '18:00' } });

  for (let i = 0; i < ownerNames.length; i++) {
    await prisma.staff.create({ data: { name: ownerNames[i], isOwner: true, ownerBayNumber: i + 1, active: true } });
  }
  for (const n of nonOwnerNames) {
    await prisma.staff.create({ data: { name: n, isOwner: false, active: true } });
  }

  console.log('Seeded 10 owners + 20 non-owners');
}

main().finally(() => prisma.$disconnect());
