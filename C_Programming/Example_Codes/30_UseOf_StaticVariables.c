#include<stdio.h>
void func(void);
int main (void)
{
    func();
    func();
    func();
    return 0;
}
void func (void)
{
    int a = 10; //as this is not a static its value is not retained
    static int b = 10; //this is a static variable changes its value at every call
    printf("a = %d, b = %d\n", a, b);
    a++;
    b++;
}