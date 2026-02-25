import { Link, Copy, CheckCircle } from 'lucide-react';

interface Block {
    block_number: number;
    current_hash: string;
    previous_hash: string;
    data_type: string;
    timestamp: string;
    verified: boolean;
}

const BlockchainFeed = ({ blocks }: { blocks: Block[] }) => {

    const truncateHash = (hash: string) => hash ? `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}` : 'N/A';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
            <h3 className="text-xl font-extrabold mb-6 flex items-center text-gray-900 tracking-tight">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                    <Link size={20} />
                </div>
                Immutable Ledger
                <span className="ml-auto text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 font-bold uppercase tracking-wide">Live Net</span>
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {blocks.map((block, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative group hover:bg-white hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">#{block.block_number}</span>
                            <span className="text-[10px] font-medium text-gray-400">{new Date(block.timestamp).toLocaleTimeString()}</span>
                        </div>

                        <div className="mb-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payload Type</div>
                            <div className="font-bold text-gray-800 text-sm flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                {block.data_type}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-[10px] font-mono">
                            <div className="flex items-center text-gray-400">
                                <span className="w-8">Prev:</span>
                                <span className="text-gray-500 truncate">{truncateHash(block.previous_hash)}</span>
                            </div>
                            <div className="flex items-center text-indigo-500 bg-indigo-50/50 p-1.5 rounded border border-indigo-100/50">
                                <span className="w-8 font-bold">Hash:</span>
                                <span className="truncate font-medium">{truncateHash(block.current_hash)}</span>
                                <Copy size={10} className="ml-auto cursor-pointer hover:text-indigo-700" />
                            </div>
                        </div>

                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                            <CheckCircle size={18} className="text-emerald-500 fill-emerald-50" />
                        </div>
                    </div>
                ))}
                {blocks.length === 0 && (
                    <div className="text-center text-gray-400 py-12 text-sm font-medium italic">
                        Waiting for mined blocks...
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockchainFeed;
