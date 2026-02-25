import { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, Link, Box, RefreshCw } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

interface Block {
  block_number: number;
  timestamp: string;
  previous_hash: string;
  current_hash: string;
  data_type: string;
  verified: boolean;
}

const Blockchain = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/blockchain`)
      .then(res => res.json())
      .then(data => {
        setBlocks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 5000); // Live polling
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 pt-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Immutable Ledger
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Live visualization of the AgroCyberChain SHA-256 Blockchain
          </p>
        </div>

        {/* Ledger Config / Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-green-500/30 p-6 rounded-2xl flex items-center">
            <div className="bg-green-500/20 p-3 rounded-full mr-4 text-green-400">
              <Shield size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-400">Network Status</div>
              <div className="font-bold text-lg text-green-400">SECURE & ACTIVE</div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-blue-500/30 p-6 rounded-2xl flex items-center">
            <div className="bg-blue-500/20 p-3 rounded-full mr-4 text-blue-400">
              <Box size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Blocks Mined</div>
              <div className="font-bold text-lg text-white">{blocks.length > 0 ? blocks[blocks.length - 1].block_number : 'Loading...'}</div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-purple-500/30 p-6 rounded-2xl flex items-center">
            <div className="bg-purple-500/20 p-3 rounded-full mr-4 text-purple-400">
              <Lock size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-400">Consensus Mechanism</div>
              <div className="font-bold text-lg text-white">Proof of Authority</div>
            </div>
          </div>
        </div>

        {/* The Chain */}
        <div className="space-y-4">
          {loading && blocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 animate-pulse">Initializing Blockchain Node...</div>
          ) : (
            blocks.map((block, index) => (
              <div key={block.block_number} className="relative">
                {/* Connector Line */}
                {index !== blocks.length - 1 && (
                  <div className="absolute left-8 top-full h-full w-1 bg-gray-700 z-0 content-['']"></div>
                )}

                <div className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-6 relative z-10 transition-all hover:scale-[1.01] hover:border-blue-500/50 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Block ID & Icon */}
                    <div className="flex items-center">
                      <div className="bg-gray-900 w-16 h-16 rounded-xl flex items-center justify-center border border-gray-600 font-mono text-xl font-bold text-blue-400 mr-4 shadow-inner">
                        #{block.block_number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30 uppercase tracking-wider font-bold">
                            {block.data_type}
                          </span>
                          {block.verified && (
                            <span className="text-green-400 flex items-center text-xs font-bold">
                              <CheckCircle size={12} className="mr-1" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {new Date(block.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Hashes */}
                    <div className="flex-1 md:px-8 space-y-2">
                      <div className="flex items-center group">
                        <div className="w-24 text-xs text-gray-500 uppercase tracking-wide">Prev Hash</div>
                        <div className="font-mono text-xs text-gray-400 bg-black/30 px-3 py-1.5 rounded w-full truncate border border-transparent group-hover:border-gray-600 transition-colors">
                          {block.previous_hash}
                        </div>
                      </div>
                      <div className="flex items-center group">
                        <div className="w-24 text-xs text-green-500 uppercase tracking-wide font-bold">Curr Hash</div>
                        <div className="font-mono text-xs text-green-400 bg-green-900/10 px-3 py-1.5 rounded w-full truncate border border-green-500/30">
                          {block.current_hash}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="text-right">
                      <div className="bg-gray-700/50 p-2 rounded-lg inline-block">
                        <Link size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={fetchBlocks}
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg hover:shadow-blue-500/50"
          >
            <RefreshCw size={20} className="mr-2" /> Sync Ledger
          </button>
          <p className="mt-4 text-xs text-gray-500">
            The ledger updates automatically every 5 seconds.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Blockchain;
