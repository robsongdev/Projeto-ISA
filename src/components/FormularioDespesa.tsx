'use client'

import React, { useState, useEffect } from 'react'
import { Despesa } from '@/types'
import { ESTADOS_CIDADES_MAP, INSTITUTOS_DE_PESQUISA } from '@/types'
import { calcularTotalDespesas, calcularLucro } from '@/utils/despesaCalculacoes'

interface FormularioDespesaProps {
    onSubmit: (despesa: Despesa) => void
    initialData?: Despesa
    isEditing?: boolean
}

export default function FormularioDespesa({ onSubmit, initialData, isEditing = false }: FormularioDespesaProps) {
    const [formData, setFormData] = useState<Partial<Despesa>>({
        dataInicio: '',
        dataTermino: '',
        estado: '',
        cidade: '',
        institutoPesquisa: '',
        estaRegistrado: 'nao',
        numeroRegistro: '',
        temContratante: 'nao',
        nomeContratante: '',
        numeroPesquisadores: 0,
        nomesPesquisadores: [],
        valorFechado: 0,
        quantidadeQuestionario: 0,
        valorQuestionario: 0,
        quantidadeDiariaCarro: 0,
        valorDiariaCarro: 0,
        quantidadeDiariaAlimentacao: 0,
        valorDiariaAlimentacao: 0,
        hospedagem: 0,
        gasolina: 0,
        custoSistema: 0,
        motoTaxi: 0,
        custoEstatistico: 0,
        outrosCustos: 0
    })

    // Estados para o modal de gasolina
    const [modalGasolinaAberto, setModalGasolinaAberto] = useState(false)
    const [valoresGasolina, setValoresGasolina] = useState<number[]>([])
    const [novoValorGasolina, setNovoValorGasolina] = useState('')

    // Estados para o modal de hospedagem
    const [modalHospedagemAberto, setModalHospedagemAberto] = useState(false)
    const [valoresHospedagem, setValoresHospedagem] = useState<number[]>([])
    const [novoValorHospedagem, setNovoValorHospedagem] = useState('')

    // Estados para o modal de moto-taxi
    const [modalMotoTaxiAberto, setModalMotoTaxiAberto] = useState(false)
    const [valoresMotoTaxi, setValoresMotoTaxi] = useState<number[]>([])
    const [novoValorMotoTaxi, setNovoValorMotoTaxi] = useState('')

    // Estados para o modal de outros custos
    const [modalOutrosCustosAberto, setModalOutrosCustosAberto] = useState(false)
    const [valoresOutrosCustos, setValoresOutrosCustos] = useState<number[]>([])
    const [novoValorOutrosCustos, setNovoValorOutrosCustos] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])

    // Função para calcular a diferença de dias entre duas datas
    const calcularDiferencaDias = (dataInicio: string, dataTermino: string): number => {
        if (!dataInicio || !dataTermino) return 0

        const inicio = new Date(dataInicio)
        const termino = new Date(dataTermino)

        // Verifica se as datas são válidas
        if (isNaN(inicio.getTime()) || isNaN(termino.getTime())) return 0

        // Calcula a diferença em milissegundos e converte para dias
        const diferencaMs = termino.getTime() - inicio.getTime()
        const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24))

        // Retorna 0 se a diferença for negativa (data de término anterior à de início)
        return diferencaDias > 0 ? diferencaDias : 0
    }

    // Função para atualizar automaticamente as diárias quando as datas mudam
    const atualizarDiariasAutomaticamente = (dataInicio: string, dataTermino: string) => {
        const diferencaDias = calcularDiferencaDias(dataInicio, dataTermino)

        setFormData((prev) => ({
            ...prev,
            quantidadeDiariaCarro: diferencaDias,
            quantidadeDiariaAlimentacao: diferencaDias
        }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        // Atualiza automaticamente as diárias quando as datas são alteradas
        if (name === 'dataInicio' || name === 'dataTermino') {
            const novaDataInicio = name === 'dataInicio' ? value : formData.dataInicio
            const novaDataTermino = name === 'dataTermino' ? value : formData.dataTermino

            if (novaDataInicio && novaDataTermino) {
                atualizarDiariasAutomaticamente(novaDataInicio, novaDataTermino)
            }
        }
    }

    // Funções para o modal de gasolina
    const abrirModalGasolina = () => {
        setModalGasolinaAberto(true)
    }

    const fecharModalGasolina = () => {
        setModalGasolinaAberto(false)
        setNovoValorGasolina('')
    }

    const adicionarValorGasolina = () => {
        const valor = parseFloat(novoValorGasolina)
        if (!isNaN(valor) && valor > 0) {
            const novosValores = [...valoresGasolina, valor]
            setValoresGasolina(novosValores)
            setNovoValorGasolina('')

            // Calcula o total e atualiza o formData
            const total = novosValores.reduce((acc, val) => acc + val, 0)
            setFormData((prev) => ({
                ...prev,
                gasolina: total
            }))
        }
    }

        const removerValorGasolina = (index: number) => {
        const novosValores = valoresGasolina.filter((_, i) => i !== index)
        setValoresGasolina(novosValores)

        // Recalcula o total
        const total = novosValores.reduce((acc, val) => acc + val, 0)
        setFormData((prev) => ({
            ...prev,
            gasolina: total
        }))
    }

    // Funções para o modal de hospedagem
    const abrirModalHospedagem = () => {
        setModalHospedagemAberto(true)
    }

    const fecharModalHospedagem = () => {
        setModalHospedagemAberto(false)
        setNovoValorHospedagem('')
    }

    const adicionarValorHospedagem = () => {
        const valor = parseFloat(novoValorHospedagem)
        if (!isNaN(valor) && valor > 0) {
            const novosValores = [...valoresHospedagem, valor]
            setValoresHospedagem(novosValores)
            setNovoValorHospedagem('')

            // Calcula o total e atualiza o formData
            const total = novosValores.reduce((acc, val) => acc + val, 0)
            setFormData((prev) => ({
                ...prev,
                hospedagem: total
            }))
        }
    }

    const removerValorHospedagem = (index: number) => {
        const novosValores = valoresHospedagem.filter((_, i) => i !== index)
        setValoresHospedagem(novosValores)

        // Recalcula o total
        const total = novosValores.reduce((acc, val) => acc + val, 0)
        setFormData((prev) => ({
            ...prev,
            hospedagem: total
        }))
    }

    // Funções para o modal de moto-taxi
    const abrirModalMotoTaxi = () => {
        setModalMotoTaxiAberto(true)
    }

    const fecharModalMotoTaxi = () => {
        setModalMotoTaxiAberto(false)
        setNovoValorMotoTaxi('')
    }

    const adicionarValorMotoTaxi = () => {
        const valor = parseFloat(novoValorMotoTaxi)
        if (!isNaN(valor) && valor > 0) {
            const novosValores = [...valoresMotoTaxi, valor]
            setValoresMotoTaxi(novosValores)
            setNovoValorMotoTaxi('')

            // Calcula o total e atualiza o formData
            const total = novosValores.reduce((acc, val) => acc + val, 0)
            setFormData((prev) => ({
                ...prev,
                motoTaxi: total
            }))
        }
    }

    const removerValorMotoTaxi = (index: number) => {
        const novosValores = valoresMotoTaxi.filter((_, i) => i !== index)
        setValoresMotoTaxi(novosValores)

        // Recalcula o total
        const total = novosValores.reduce((acc, val) => acc + val, 0)
        setFormData((prev) => ({
            ...prev,
            motoTaxi: total
        }))
    }

    // Funções para o modal de outros custos
    const abrirModalOutrosCustos = () => {
        setModalOutrosCustosAberto(true)
    }

    const fecharModalOutrosCustos = () => {
        setModalOutrosCustosAberto(false)
        setNovoValorOutrosCustos('')
    }

    const adicionarValorOutrosCustos = () => {
        const valor = parseFloat(novoValorOutrosCustos)
        if (!isNaN(valor) && valor > 0) {
            const novosValores = [...valoresOutrosCustos, valor]
            setValoresOutrosCustos(novosValores)
            setNovoValorOutrosCustos('')

            // Calcula o total e atualiza o formData
            const total = novosValores.reduce((acc, val) => acc + val, 0)
            setFormData((prev) => ({
                ...prev,
                outrosCustos: total
            }))
        }
    }

    const removerValorOutrosCustos = (index: number) => {
        const novosValores = valoresOutrosCustos.filter((_, i) => i !== index)
        setValoresOutrosCustos(novosValores)

        // Recalcula o total
        const total = novosValores.reduce((acc, val) => acc + val, 0)
        setFormData((prev) => ({
            ...prev,
            outrosCustos: total
        }))
    }

    const handleNomePesquisadorChange = (index: number, value: string) => {
        const novosNomes = [...(formData.nomesPesquisadores || [])]
        novosNomes[index] = value
        setFormData((prev) => ({
            ...prev,
            nomesPesquisadores: novosNomes
        }))
    }

    const removerPesquisadorField = (index: number) => {
        const novosNomes = formData.nomesPesquisadores?.filter((_, i) => i !== index) || []
        setFormData((prev) => ({
            ...prev,
            nomesPesquisadores: novosNomes,
            numeroPesquisadores: novosNomes.length
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const totalDespesas = calcularTotalDespesas(formData as Despesa)
        const lucro = calcularLucro(formData as Despesa)

        const despesaCompleta: Despesa = {
            ...formData,
            totalDespesas: totalDespesas,
            lucro: lucro
        } as Despesa

        onSubmit(despesaCompleta)
    }

    return (
        <div className="mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{isEditing ? 'Editar Despesa' : 'Nova Despesa'}</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Seção 1: Informações Básicas */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Informações Básicas
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Data de Início
                                </label>
                                <input
                                    type="date"
                                    name="dataInicio"
                                    value={formData.dataInicio}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Data de Término
                                </label>
                                <input
                                    type="date"
                                    name="dataTermino"
                                    value={formData.dataTermino}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Localização */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Localização
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Estado
                                </label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                >
                                    <option value="">Selecione um estado</option>
                                    {Object.keys(ESTADOS_CIDADES_MAP).map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    Cidade
                                </label>
                                <select
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                >
                                    <option value="">Selecione uma cidade</option>
                                    {formData.estado &&
                                        ESTADOS_CIDADES_MAP[formData.estado]?.map((cidade) => (
                                            <option key={cidade} value={cidade}>
                                                {cidade}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                Instituto de Pesquisa
                            </label>
                            <select
                                name="institutoPesquisa"
                                value={formData.institutoPesquisa}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                            >
                                <option value="">Selecione um instituto</option>
                                {INSTITUTOS_DE_PESQUISA.map((instituto) => (
                                    <option key={instituto} value={instituto}>
                                        {instituto}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Seção 3: Registro e Contratante */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Registro e Contratante
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Está Registrado?</label>
                                <select
                                    name="estaRegistrado"
                                    value={formData.estaRegistrado}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                >
                                    <option value="nao">Não</option>
                                    <option value="sim">Sim</option>
                                </select>
                            </div>

                            {formData.estaRegistrado === 'sim' && (
                                <div>
                                    <label className="block text-base font-bold text-gray-800 mb-3">Número do Registro</label>
                                    <input
                                        type="text"
                                        name="numeroRegistro"
                                        value={formData.numeroRegistro}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Tem Contratante?</label>
                                <select
                                    name="temContratante"
                                    value={formData.temContratante}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                >
                                    <option value="nao">Não</option>
                                    <option value="sim">Sim</option>
                                </select>
                            </div>

                            {formData.temContratante === 'sim' && (
                                <div>
                                    <label className="block text-base font-bold text-gray-800 mb-3">Nome do Contratante</label>
                                    <input
                                        type="text"
                                        name="nomeContratante"
                                        value={formData.nomeContratante}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção 4: Pesquisadores */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Pesquisadores
                        </h3>

                        <div>
                            <label className="text-base font-bold text-gray-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Número de Pesquisadores
                            </label>
                            <input
                                type="number"
                                name="numeroPesquisadores"
                                value={formData.numeroPesquisadores}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                            />
                        </div>

                        {/* Nomes dos Pesquisadores */}
                        {(formData.numeroPesquisadores || 0) > 0 && (
                            <div className="mt-6">
                                <label className="block text-base font-bold text-gray-800 mb-3">Nomes dos Pesquisadores</label>
                                <div className="space-y-3">
                                    {Array.from({ length: formData.numeroPesquisadores || 0 }, (_, index) => (
                                        <div key={index} className="flex gap-3">
                                            <input
                                                type="text"
                                                value={formData.nomesPesquisadores?.[index] || ''}
                                                onChange={(e) => handleNomePesquisadorChange(index, e.target.value)}
                                                placeholder={`Nome do pesquisador ${index + 1}`}
                                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removerPesquisadorField(index)}
                                                className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Seção 5: Valores */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Valores e Custos
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2 col-span-full">
                                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    Valor Fechado (R$)
                                </label>
                                <input
                                    type="number"
                                    name="valorFechado"
                                    value={formData.valorFechado}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Quantidade de Questionários</label>
                                <input
                                    type="number"
                                    name="quantidadeQuestionario"
                                    value={formData.quantidadeQuestionario}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Valor por Questionário (R$)</label>
                                <input
                                    type="number"
                                    name="valorQuestionario"
                                    value={formData.valorQuestionario}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Quantidade de Diárias de Carro</label>
                                <input
                                    type="number"
                                    name="quantidadeDiariaCarro"
                                    value={formData.quantidadeDiariaCarro}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Valor da Diária de Carro (R$)</label>
                                <input
                                    type="number"
                                    name="valorDiariaCarro"
                                    value={formData.valorDiariaCarro}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Quantidade de Diárias de Alimentação</label>
                                <input
                                    type="number"
                                    name="quantidadeDiariaAlimentacao"
                                    value={formData.quantidadeDiariaAlimentacao}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Valor da Diária de Alimentação (R$)</label>
                                <input
                                    type="number"
                                    name="valorDiariaAlimentacao"
                                    value={formData.valorDiariaAlimentacao}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="text-base font-bold text-gray-800">
                                        Hospedagem (R$)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={abrirModalHospedagem}
                                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg"
                                        title="Adicionar valores de hospedagem"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    name="hospedagem"
                                    value={formData.hospedagem}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Custo Estatístico (R$)</label>
                                <input
                                    type="number"
                                    name="custoEstatistico"
                                    value={formData.custoEstatistico}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="text-base font-bold text-gray-800">
                                        Gasolina (R$)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={abrirModalGasolina}
                                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg"
                                        title="Adicionar valores de gasolina"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    name="gasolina"
                                    value={formData.gasolina}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3">Custo do Sistema (R$)</label>
                                <input
                                    type="number"
                                    name="custoSistema"
                                    value={formData.custoSistema}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="text-base font-bold text-gray-800">
                                        Moto-Táxi (R$)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={abrirModalMotoTaxi}
                                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg"
                                        title="Adicionar valores de moto-táxi"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    name="motoTaxi"
                                    value={formData.motoTaxi}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <label className="text-base font-bold text-gray-800">
                                    Outros Custos (R$)
                                </label>
                                                                    <button
                                        type="button"
                                        onClick={abrirModalOutrosCustos}
                                        className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg"
                                        title="Adicionar valores de outros custos"
                                    >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="number"
                                name="outrosCustos"
                                value={formData.outrosCustos}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {isEditing ? 'Atualizar Despesa' : 'Salvar Despesa'}
                        </button>
                    </div>
                </form>

                {/* Modal de Gasolina */}
                {modalGasolinaAberto && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Adicionar Valores de Gasolina
                                </h3>
                                <button
                                    onClick={fecharModalGasolina}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-bold text-gray-800 mb-3">Novo Valor (R$)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            value={novoValorGasolina}
                                            onChange={(e) => setNovoValorGasolina(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    adicionarValorGasolina()
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={adicionarValorGasolina}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg font-bold"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>

                                {valoresGasolina.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-3">Valores Adicionados:</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {valoresGasolina.map((valor, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                                    <span className="text-gray-700 font-medium">
                                                        R$ {valor.toFixed(2)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removerValorGasolina(index)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                                                        title="Remover valor"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-blue-800">Total:</span>
                                        <span className="text-2xl font-bold text-blue-800">
                                            R$ {formData.gasolina?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={fecharModalGasolina}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg font-bold"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Hospedagem */}
                {modalHospedagemAberto && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Adicionar Valores de Hospedagem
                                </h3>
                                <button
                                    onClick={fecharModalHospedagem}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-bold text-gray-800 mb-3">Novo Valor (R$)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            value={novoValorHospedagem}
                                            onChange={(e) => setNovoValorHospedagem(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    adicionarValorHospedagem()
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={adicionarValorHospedagem}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg font-bold"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>

                                {valoresHospedagem.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-3">Valores Adicionados:</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {valoresHospedagem.map((valor, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                                    <span className="text-gray-700 font-medium">
                                                        R$ {valor.toFixed(2)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removerValorHospedagem(index)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                                                        title="Remover valor"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-blue-800">Total:</span>
                                        <span className="text-2xl font-bold text-blue-800">
                                            R$ {formData.hospedagem?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={fecharModalHospedagem}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg font-bold"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Moto-Táxi */}
                {modalMotoTaxiAberto && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Adicionar Valores de Moto-Táxi
                                </h3>
                                <button
                                    onClick={fecharModalMotoTaxi}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-bold text-gray-800 mb-3">Novo Valor (R$)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            value={novoValorMotoTaxi}
                                            onChange={(e) => setNovoValorMotoTaxi(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    adicionarValorMotoTaxi()
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={adicionarValorMotoTaxi}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg font-bold"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>

                                {valoresMotoTaxi.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-3">Valores Adicionados:</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {valoresMotoTaxi.map((valor, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                                    <span className="text-gray-700 font-medium">
                                                        R$ {valor.toFixed(2)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removerValorMotoTaxi(index)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                                                        title="Remover valor"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-blue-800">Total:</span>
                                        <span className="text-2xl font-bold text-blue-800">
                                            R$ {formData.motoTaxi?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={fecharModalMotoTaxi}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg font-bold"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Outros Custos */}
                {modalOutrosCustosAberto && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Adicionar Valores de Outros Custos
                                </h3>
                                <button
                                    onClick={fecharModalOutrosCustos}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-bold text-gray-800 mb-3">Novo Valor (R$)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            value={novoValorOutrosCustos}
                                            onChange={(e) => setNovoValorOutrosCustos(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    adicionarValorOutrosCustos()
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={adicionarValorOutrosCustos}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg font-bold"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>

                                {valoresOutrosCustos.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-3">Valores Adicionados:</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {valoresOutrosCustos.map((valor, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                                    <span className="text-gray-700 font-medium">
                                                        R$ {valor.toFixed(2)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removerValorOutrosCustos(index)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                                                        title="Remover valor"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-blue-800">Total:</span>
                                        <span className="text-2xl font-bold text-blue-800">
                                            R$ {formData.outrosCustos?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={fecharModalOutrosCustos}
                                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg font-bold"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
