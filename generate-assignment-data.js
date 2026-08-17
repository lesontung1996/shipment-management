const fs = require("fs");
const statusList = ["OPEN", "COMPLETED"];
const statuses = statusList.map((status) => ({ id: status }));
const clients = [
  "Sony",
  "Samsung",
  "DHL",
  "CargoTrans",
  "ShipCo",
  "Logix",
  "Oceanic",
];
const assignments = [];
for (let i = 1; i <= 20; i++) {
  const clientCount = 1 + (i % 3);
  const assignmentClients = [];
  for (let j = 0; j < clientCount; j++) {
    assignmentClients.push(clients[(i + j) % clients.length]);
  }
  assignments.push({
    id: `as_${String(i).padStart(3, "0")}`,
    label: `TX-${100 + i}`,
    status: statusList[i % statusList.length],
    clients: assignmentClients,
    shipment_count: 2 + (i % 6),
  });
}
const result = { statuses, assignments };
fs.writeFileSync("assignments.json", JSON.stringify(result, null, 2));
console.log("assignment data generated");
