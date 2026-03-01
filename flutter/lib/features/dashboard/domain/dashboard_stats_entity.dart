class DashboardStatsEntity {
  const DashboardStatsEntity({
    required this.totalClients,
    required this.totalPets,
    required this.bookingsThisMonth,
    required this.incidentsThisMonth,
  });

  final int totalClients;
  final int totalPets;
  final int bookingsThisMonth;
  final int incidentsThisMonth;
}
