using Sieve.Models;

namespace service;

public interface IService<TRes, in TCreate, in TUpdate>
{
    public Task<List<TRes>> Get(SieveModel model);

    public Task<TRes> Create(TCreate request);
    public Task<TRes> Update(TUpdate request);
    public Task<TRes> Delete(string id);
}