import React, { useEffect, useState } from 'react';
import { fetchLeads } from '../../services/apiService';
import { LeadData } from '../../types';
import { useTenantStore } from '../../stores/tenantStore';
import electronService from '../../services/electronService';

const LeadsDashboard: React.FC = () => {
    const [leads, setLeads] = useState<LeadData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const tenantConfig = useTenantStore((state) => state.tenantConfig);

    useEffect(() => {
        const loadLeads = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let data: LeadData[];
                
                // Buscar do Electron se disponível
                if (electronService.isRunningInElectron() && tenantConfig) {
                  console.log('🖥️ Buscando leads do Electron...');
                  const result = await electronService.getLeads(tenantConfig.tenant_id);
                  if (result.success && result.data) {
                    data = result.data;
                    console.log(`✅ ${data.length} leads carregados do Electron`);
                  } else {
                    throw new Error('Erro ao buscar leads do Electron');
                  }
                } else {
                  console.log('📡 Buscando leads da API...');
                  data = await fetchLeads();
                }
                
                setLeads(data);
            } catch (err) {
                setError("Falha ao carregar leads.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadLeads();
    }, [tenantConfig]);

    const exportToCSV = () => {
        if (leads.length === 0) return;
        const headers = ["Timestamp", "Nome", "Email", "Telefone", "Jogo", "Consentimento"];
        const csvRows = [
            headers.join(','),
            ...leads.map(lead => [
                `"${new Date(lead.timestamp).toLocaleString('pt-BR')}"`,
                `"${lead.name}"`,
                `"${lead.email}"`,
                `"${lead.phone}"`,
                `"${lead.game_selected}"`,
                lead.consent
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'leads.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calcular métricas
    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const leadsToday = leads.filter(lead => isToday(new Date(lead.timestamp))).length;

    const getMostPopularGame = () => {
        if (leads.length === 0) return 'N/A';
        const gameCount: { [key: string]: number } = {};
        leads.forEach(lead => {
            if (lead.game_selected) {
                gameCount[lead.game_selected] = (gameCount[lead.game_selected] || 0) + 1;
            }
        });
        const mostPopular = Object.entries(gameCount).sort((a, b) => b[1] - a[1])[0];
        return mostPopular ? mostPopular[0].replace(/_/g, ' ') : 'N/A';
    };

    const getAverageLeadsPerDay = () => {
        if (leads.length === 0) return 0;
        const dates = leads.map(l => new Date(l.timestamp).toDateString());
        const uniqueDays = new Set(dates).size;
        return uniqueDays > 0 ? Math.round(leads.length / uniqueDays) : leads.length;
    };

    if (loading) {
        return <div className="text-center p-8">Carregando leads...</div>;
    }

    if (error) {
         return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Leads Capturados</h1>
                <button onClick={exportToCSV} disabled={leads.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    📥 Exportar para CSV
                </button>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total de Leads</p>
                            <p className="text-4xl font-bold mt-2">{leads.length}</p>
                        </div>
                        <div className="text-5xl opacity-30">👥</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Leads Hoje</p>
                            <p className="text-4xl font-bold mt-2">{leadsToday}</p>
                        </div>
                        <div className="text-5xl opacity-30">📈</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Jogo Mais Popular</p>
                            <p className="text-2xl font-bold mt-2 capitalize">{getMostPopularGame()}</p>
                        </div>
                        <div className="text-5xl opacity-30">🎮</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">Média/Dia</p>
                            <p className="text-4xl font-bold mt-2">{getAverageLeadsPerDay()}</p>
                        </div>
                        <div className="text-5xl opacity-30">📊</div>
                    </div>
                </div>
            </div>
            {leads.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    <p>Nenhum lead capturado ainda.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jogo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.map((lead, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.timestamp).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{lead.game_selected?.replace(/_/g, ' ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeadsDashboard;