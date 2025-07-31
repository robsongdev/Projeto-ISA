'use client'

import React, { useState, useEffect } from 'react'
import { Despesa } from '@/types'
import { ESTADOS_CIDADES_MAP, INSTITUTOS_DE_PESQUISA } from '@/types'
import { calcularTotalDespesas, calcularLucro } from '@/utils/despesaCalculacoes'
import {
    FiCalendar,
    FiMapPin,
    FiHome,
    FiCheckCircle,
    FiUsers,
    FiDollarSign,
    FiPlus,
    FiX,
    FiTrash2,
    FiZap,
    FiShoppingBag,
    FiPackage,
    FiBookOpen
} from 'react-icons/fi'

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

    // Estado para valor de alimentação por pesquisador
    const [valorAlimentacaoPorPesquisador, setValorAlimentacaoPorPesquisador] = useState('')

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])

    // useEffect para recalcular valor de alimentação quando número de pesquisadores ou valor por pesquisador mudar
    useEffect(() => {
        if (valorAlimentacaoPorPesquisador && valorAlimentacaoPorPesquisador !== '' && formData.numeroPesquisadores && formData.numeroPesquisadores > 0) {
            const valor = parseFloat(valorAlimentacaoPorPesquisador) || 0
            const numeroPesquisadores = formData.numeroPesquisadores || 0
            const total = valor * numeroPesquisadores

            setFormData((prev) => ({
                ...prev,
                valorDiariaAlimentacao: total
            }))
        }
    }, [valorAlimentacaoPorPesquisador, formData.numeroPesquisadores])

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

        // Atualiza valor de alimentação quando o número de pesquisadores muda
        if (name === 'numeroPesquisadores') {
            // Aguarda o estado ser atualizado e depois recalcula
            setTimeout(() => {
                if (valorAlimentacaoPorPesquisador && valorAlimentacaoPorPesquisador !== '') {
                    const valor = parseFloat(valorAlimentacaoPorPesquisador) || 0
                    const numeroPesquisadores = parseInt(value) || 0
                    const total = valor * numeroPesquisadores

                    setFormData((prev) => ({
                        ...prev,
                        valorDiariaAlimentacao: total
                    }))
                }
            }, 100)
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

    // Função para calcular valor de alimentação baseado no número de pesquisadores
    const calcularValorAlimentacao = (valorPorPesquisador: string) => {
        const valor = parseFloat(valorPorPesquisador) || 0
        const numeroPesquisadores = formData.numeroPesquisadores || 0
        const total = valor * numeroPesquisadores

        setFormData((prev) => ({
            ...prev,
            valorDiariaAlimentacao: total
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
                            <FiBookOpen className="w-6 h-6 mr-3 text-gray-600" />
                            Informações Básicas
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <FiCalendar className="w-5 h-5 mr-2 text-gray-600" />
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
                                    <FiCalendar className="w-5 h-5 mr-2 text-gray-600" />
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
                            <FiMapPin className="w-6 h-6 mr-3 text-gray-600" />
                            Localização
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <FiMapPin className="w-5 h-5 mr-2 text-gray-600" />
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
                                    <FiHome className="w-5 h-5 mr-2 text-gray-600" />
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
                                <FiHome className="w-5 h-5 mr-2 text-gray-600" />
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
                            <FiCheckCircle className="w-6 h-6 mr-3 text-gray-600" />
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
                            <FiUsers className="w-6 h-6 mr-3 text-gray-600" />
                            Pesquisadores
                        </h3>

                        <div>
                            <label className="text-base font-bold text-gray-800 mb-3 flex items-center">
                                <FiUsers className="w-5 h-5 mr-2 text-gray-600" />
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

                        {/* Campo de valor de alimentação por pesquisador */}
                        {(formData.numeroPesquisadores || 0) > 0 && (
                            <div className="mt-6">
                                <label className="text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <FiShoppingBag className="w-5 h-5 mr-2 text-gray-600" />
                                    Valor de Alimentação por Pesquisador (R$)
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        value={valorAlimentacaoPorPesquisador}
                                        onChange={(e) => setValorAlimentacaoPorPesquisador(e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700"
                                    />
                                    <div className="flex items-center px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-800 font-bold">
                                        <span>Total: R$ {formData.valorDiariaAlimentacao?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Valor será multiplicado por {formData.numeroPesquisadores} pesquisador(es)
                                </p>
                            </div>
                        )}

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
                                                <FiTrash2 className="w-5 h-5" />
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
                            <FiDollarSign className="w-6 h-6 mr-3 text-blue-600" />
                            Valores e Custos
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2 col-span-full">
                                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center">
                                    <FiDollarSign className="w-5 h-5 mr-2 text-gray-600" />
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
                                    readOnly
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
                                        <FiPlus className="w-4 h-4" />
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
                                        <FiPlus className="w-4 h-4" />
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
                                        <FiPlus className="w-4 h-4" />
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
                                        <FiPlus className="w-4 h-4" />
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
                            <FiCheckCircle className="w-6 h-6" />
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
                                    <FiZap className="w-6 h-6 mr-3 text-blue-600" />
                                    Adicionar Valores de Gasolina
                                </h3>
                                <button
                                    onClick={fecharModalGasolina}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <FiX className="w-6 h-6" />
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
                                                            <FiTrash2 className="w-5 h-5" />
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
                                    <FiHome className="w-6 h-6 mr-3 text-blue-600" />
                                    Adicionar Valores de Hospedagem
                                </h3>
                                <button
                                    onClick={fecharModalHospedagem}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <FiX className="w-6 h-6" />
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
                                                        <FiTrash2 className="w-5 h-5" />
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
                                    <FiZap className="w-6 h-6 mr-3 text-blue-600" />
                                    Adicionar Valores de Moto-Táxi
                                </h3>
                                <button
                                    onClick={fecharModalMotoTaxi}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <FiX className="w-6 h-6" />
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
                                                        <FiTrash2 className="w-5 h-5" />
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
                                    <FiPackage className="w-6 h-6 mr-3 text-blue-600" />
                                    Adicionar Valores de Outros Custos
                                </h3>
                                <button
                                    onClick={fecharModalOutrosCustos}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <FiX className="w-6 h-6" />
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
                                                        <FiTrash2 className="w-5 h-5" />
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
